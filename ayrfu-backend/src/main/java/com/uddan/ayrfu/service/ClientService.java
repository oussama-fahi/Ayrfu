package com.uddan.ayrfu.service;


import com.uddan.ayrfu.dto.request.ClientRequest;
import com.uddan.ayrfu.dto.response.ClientResponse;

import java.util.List;

public interface ClientService {

    ClientResponse createClient(ClientRequest clientRequest);

    ClientResponse getClientById(Long id);

    ClientResponse getClientByEmail(String email);

    List<ClientResponse> getAllClients();

    ClientResponse updateClient(Long id, ClientRequest clientRequest);
    boolean isOwnProfile(Long clientId, Long userId);
    void deleteClient(Long id);
}
