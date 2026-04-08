package com.ayrfu.ayrfu.service;


import com.ayrfu.ayrfu.dto.request.ClientRequest;
import com.ayrfu.ayrfu.dto.response.ClientResponse;

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
